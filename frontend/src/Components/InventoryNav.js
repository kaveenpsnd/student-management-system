import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Row, Col } from 'react-bootstrap';
import './InventoryNav.css';

const InventoryNav = () => {
    const navItems = [
        {
            title: 'Inventory List',
            description: 'View and manage all inventory items',
            path: '/inventory/list',
            icon: '📋'
        },
        {
            title: 'Add New Item',
            description: 'Add new items to inventory',
            path: '/inventory/add',
            icon: '➕'
        },
        {
            title: 'Stock Report',
            description: 'View detailed stock reports',
            path: '/inventory/reports/stock',
            icon: '📈'
        }
    ];

    return (
        <div className="inventory-nav">
            <h2 className="section-title mb-4">Inventory Management</h2>
            <Row>
                {navItems.map((item, index) => (
                    <Col key={index} md={6} lg={3} className="mb-4">
                        <Link to={item.path} className="nav-link">
                            <Card className="nav-card h-100">
                                <Card.Body>
                                    <div className="nav-icon">{item.icon}</div>
                                    <Card.Title>{item.title}</Card.Title>
                                    <Card.Text>{item.description}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Link>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default InventoryNav; 