import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Card, Row, Col, Badge } from 'react-bootstrap';
import { CSVLink } from 'react-csv';
import { inventoryApi } from '../services/api';
import './StockReport.css';

const StockReport = () => {
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchReportData();
    }, []);

    const fetchReportData = async () => {
        try {
            const response = await inventoryApi.getStockReport();
            setReportData(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch report data');
            setLoading(false);
        }
    };

    const headers = [
        { label: "Item Name", key: "name" },
        { label: "Quantity", key: "quantity" },
        { label: "Category", key: "category" },
        { label: "Last Restocked", key: "lastRestocked" }
    ];

    const formatDate = (dateString) => {
        if (!dateString) return "Not Available";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "Not Available";
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getTotalItems = () => reportData.length;
    const getTotalQuantity = () => reportData.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const getLowStockItems = () => reportData.filter(item => (item.quantity || 0) < 10).length;

    if (loading) return (
        <Container className="mt-4">
            <div className="text-center">Loading...</div>
        </Container>
    );
    
    if (error) return (
        <Container className="mt-4">
            <div className="text-center text-danger">{error}</div>
        </Container>
    );

    return (
        <Container className="mt-4">
            <Card className="mb-4 dashboard-card">
                <Card.Body>
                    <Row>
                        <Col md={4} className="text-center">
                            <div className="stat-card">
                                <h5 className="stat-title">Total Items</h5>
                                <h2 className="stat-value">{getTotalItems()}</h2>
                            </div>
                        </Col>
                        <Col md={4} className="text-center">
                            <div className="stat-card">
                                <h5 className="stat-title">Total Quantity</h5>
                                <h2 className="stat-value">{getTotalQuantity()}</h2>
                            </div>
                        </Col>
                        <Col md={4} className="text-center">
                            <div className="stat-card">
                                <h5 className="stat-title">Low Stock Items</h5>
                                <h2 className="stat-value text-warning">{getLowStockItems()}</h2>
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="report-title">Stock Report</h2>
                <CSVLink
                    data={reportData}
                    headers={headers}
                    filename="stock-report.csv"
                    className="btn btn-primary export-btn"
                >
                    <i className="fas fa-download me-2"></i>
                    Download CSV
                </CSVLink>
            </div>

            <div className="table-responsive">
                <Table className="table-hover table-bordered stock-table">
                    <thead>
                        <tr className="table-header">
                            <th>Item Name</th>
                            <th>Quantity</th>
                            <th>Category</th>
                            <th>Last Restocked</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reportData.map((item, index) => (
                            <tr key={index} className="table-row">
                                <td className="item-name">{item.name || "N/A"}</td>
                                <td className="text-center">
                                    <span className="quantity-badge">
                                        {item.quantity || 0}
                                    </span>
                                </td>
                                <td className="text-center">
                                    <Badge bg="info" className="category-badge">
                                        {item.category || "Uncategorized"}
                                    </Badge>
                                </td>
                                <td className="text-center">{formatDate(item.lastRestocked)}</td>
                                <td className="text-center">
                                    {item.quantity === 0 ? (
                                        <Badge bg="danger" className="status-badge">Out of Stock</Badge>
                                    ) : item.quantity < 10 ? (
                                        <Badge bg="warning" className="status-badge">Low Stock</Badge>
                                    ) : (
                                        <Badge bg="success" className="status-badge">In Stock</Badge>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </Container>
    );
};

export default StockReport; 