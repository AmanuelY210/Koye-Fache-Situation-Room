const db = require('../config/database');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');

exports.generateReport = async (req, res) => {
  try {
    const { type, format } = req.params;
    const { start_date, end_date } = req.query;

    let dateFilter = '';
    let params = [];

    switch (type) {
      case 'daily':
        dateFilter = 'DATE(s.created_at) = CURDATE()';
        break;
      case 'weekly':
        dateFilter = 'YEARWEEK(s.created_at, 1) = YEARWEEK(CURDATE(), 1)';
        break;
      case 'monthly':
        dateFilter = 'MONTH(s.created_at) = MONTH(CURDATE()) AND YEAR(s.created_at) = YEAR(CURDATE())';
        break;
      case 'yearly':
        dateFilter = 'YEAR(s.created_at) = YEAR(CURDATE())';
        break;
      case 'custom':
        if (start_date && end_date) {
          dateFilter = 's.created_at >= ? AND s.created_at <= ?';
          params = [start_date, end_date + ' 23:59:59'];
        } else {
          return res.status(400).json({ message: 'Start date and end date required for custom report.' });
        }
        break;
      default:
        return res.status(400).json({ message: 'Invalid report type.' });
    }

    let query = `SELECT s.*, u.full_name as user_name, u.username 
                 FROM electors_submissions s 
                 LEFT JOIN users u ON s.user_id = u.id 
                 WHERE ${dateFilter} 
                 ORDER BY s.created_at DESC`;

    const [rows] = await db.query(query, params);

    const [totalApproved] = await db.query(
      `SELECT COALESCE(SUM(elector_number), 0) as total FROM electors_submissions WHERE status = 'approved' AND ${dateFilter}`,
      params
    );

    const reportData = {
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Report`,
      generatedAt: new Date().toISOString(),
      totalApproved: totalApproved[0].total,
      rows
    };

    if (format === 'pdf') {
      await generatePDF(res, reportData);
    } else if (format === 'excel' || format === 'csv') {
      await generateExcel(res, reportData, format === 'csv');
    } else {
      res.json(reportData);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

async function generatePDF(res, data) {
  const doc = new PDFDocument({ margin: 30, size: 'A4' });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${data.title.replace(/\s+/g, '_').toLowerCase()}.pdf"`);

  doc.pipe(res);

  doc.fontSize(20).text(data.title, { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Generated: ${new Date(data.generatedAt).toLocaleString()}`, { align: 'center' });
  doc.moveDown();
  doc.fontSize(14).text(`Total Approved Electors: ${data.totalApproved.toLocaleString()}`, { align: 'center' });
  doc.moveDown();

  doc.fontSize(10);
  doc.text('ID | User | Elector Number | Status | Date', { underline: true });
  doc.moveDown(0.5);

  data.rows.forEach(row => {
    doc.text(`${row.id} | ${row.user_name || 'N/A'} | ${row.elector_number} | ${row.status} | ${new Date(row.created_at).toLocaleDateString()}`);
  });

  doc.end();
}

async function generateExcel(res, data, isCsv) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(data.title);

  sheet.columns = [
    { header: 'ID', key: 'id', width: 10 },
    { header: 'User', key: 'user_name', width: 30 },
    { header: 'Username', key: 'username', width: 20 },
    { header: 'Elector Number', key: 'elector_number', width: 20 },
    { header: 'Description', key: 'description', width: 40 },
    { header: 'Status', key: 'status', width: 15 },
    { header: 'Date', key: 'created_at', width: 20 }
  ];

  data.rows.forEach(row => {
    sheet.addRow(row);
  });

  sheet.addRow({});
  sheet.addRow({ id: 'Total Approved Electors:', elector_number: data.totalApproved });

  if (isCsv) {
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${data.title.replace(/\s+/g, '_').toLowerCase()}.csv"`);
    await workbook.csv.write(res);
  } else {
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${data.title.replace(/\s+/g, '_').toLowerCase()}.xlsx"`);
    await workbook.xlsx.write(res);
  }
}
