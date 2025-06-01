import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Header } from './header'
import { Footer } from './footer'
import { Outlet } from 'react-router-dom';

const Content = () => {
    return (
        <Container className="my-4">
            <Header />
            <Row as="main">
                <Col>
                    <Outlet />
                </Col>
            </Row>
            <Footer />
        </Container>
    );
}

export { Content }