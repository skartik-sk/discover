import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Project {
  name: string;
  tagline: string;
  category: string;
  chain: string;
}

interface Analytics {
  totalUpvotes: number;
  totalReviews: number;
  averageRating: number;
  categoryRank: number;
  categoryTotal: number;
  ratingDistribution: Array<{ rating: number; count: number }>;
  recentReviews: Array<{
    user: string;
    rating: number;
    comment: string;
    createdAt: number;
  }>;
}

export async function exportProjectPdf(project: Project, analytics: Analytics) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header with dark background and lime green logo
  doc.setFillColor(10, 10, 10); // Dark background
  doc.rect(0, 0, pageWidth, 30, 'F');
  
  // Add "DISCOVER" logo text
  doc.setTextColor(204, 255, 0); // Lime green
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('DISCOVER', 14, 20);
  
  // Project name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text('Analytics Report', pageWidth - 14, 20, { align: 'right' });
  
  // Reset text color for body
  doc.setTextColor(0, 0, 0);
  
  // Project Information Section
  let yPos = 45;
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Project Information', 14, yPos);
  
  yPos += 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Name: ${project.name}`, 14, yPos);
  yPos += 6;
  doc.text(`Tagline: ${project.tagline}`, 14, yPos);
  yPos += 6;
  doc.text(`Category: ${project.category}`, 14, yPos);
  yPos += 6;
  doc.text(`Blockchain: ${project.chain}`, 14, yPos);
  
  // Statistics Section
  yPos += 15;
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Statistics Overview', 14, yPos);
  
  yPos += 5;
  autoTable(doc, {
    startY: yPos,
    head: [['Metric', 'Value']],
    body: [
      ['Total Upvotes', analytics.totalUpvotes.toString()],
      ['Total Reviews', analytics.totalReviews.toString()],
      ['Average Rating', `${analytics.averageRating.toFixed(1)} / 5.0`],
      ['Category Rank', `#${analytics.categoryRank} of ${analytics.categoryTotal}`],
    ],
    theme: 'grid',
    headStyles: {
      fillColor: [204, 255, 0],
      textColor: [0, 0, 0],
      fontStyle: 'bold',
    },
    margin: { left: 14, right: 14 },
  });
  
  // Rating Distribution
  yPos = (doc as any).lastAutoTable.finalY + 15;
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Rating Distribution', 14, yPos);
  
  yPos += 5;
  autoTable(doc, {
    startY: yPos,
    head: [['Stars', 'Count', 'Percentage']],
    body: analytics.ratingDistribution.map((item) => {
      const percentage = analytics.totalReviews > 0 
        ? ((item.count / analytics.totalReviews) * 100).toFixed(1)
        : '0.0';
      return [
        `${item.rating} ⭐`,
        item.count.toString(),
        `${percentage}%`,
      ];
    }),
    theme: 'striped',
    headStyles: {
      fillColor: [204, 255, 0],
      textColor: [0, 0, 0],
      fontStyle: 'bold',
    },
    margin: { left: 14, right: 14 },
  });
  
  // Recent Reviews
  if (analytics.recentReviews.length > 0) {
    yPos = (doc as any).lastAutoTable.finalY + 15;
    
    // Check if we need a new page
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Recent Reviews', 14, yPos);
    
    yPos += 5;
    autoTable(doc, {
      startY: yPos,
      head: [['User', 'Rating', 'Comment', 'Date']],
      body: analytics.recentReviews.slice(0, 5).map((review) => [
        review.user,
        `${'⭐'.repeat(review.rating)}`,
        review.comment.length > 50 
          ? review.comment.substring(0, 50) + '...' 
          : review.comment,
        new Date(review.createdAt).toLocaleDateString(),
      ]),
      theme: 'striped',
      headStyles: {
        fillColor: [204, 255, 0],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
      },
      columnStyles: {
        2: { cellWidth: 80 },
      },
      margin: { left: 14, right: 14 },
    });
  }
  
  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Generated on ${new Date().toLocaleDateString()} | Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }
  
  // Save the PDF
  const fileName = `${project.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-analytics-report.pdf`;
  doc.save(fileName);
}
