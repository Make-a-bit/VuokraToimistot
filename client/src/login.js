import React, { useState } from "react";
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

const Login = () => {
    const [userName, setUserName] = useState("");
    const [userPassword, setUserPassword] = useState("");

    const btnLoginPressed = async () => {
        const URI = "http://localhost:5140/login/auth";
        try {
            const options = {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json;charset=UTF-8",
                },
                body: JSON.stringify({
                    UserName: userName,
                    Password: userPassword,
                }),
            };

            console.log("OPTIONS:", options)
            const response = await fetch(URI, options);
            const data = await response.json();
            console.log("DATA:", data)
        } catch (error) {
            console.log("ERROR:", error);
        }
    }

    return (
        <Container fluid="sm" className="mt-5">
            <Form>
              <Row className="justify-content-center mb-3">
                    <Col xs={10} sm={6} md={4}>
                        <Form.Control placeholder="User name" onChange={(e) => setUserName(e.target.value)} />
                </Col>
              </Row>
              <Row className="justify-content-center mb-3">
                    <Col xs={10} sm={6} md={4}>
                        <Form.Control placeholder="Password" onChange={(e) => setUserPassword(e.target.value)} />
                </Col>
              </Row>
                <Row className="justify-content-center">
                    <Col xs={"auto"}>
                        <Button variant="primary" onClick={btnLoginPressed}>Kirjaudu</Button>
                    </Col>
                </Row>
            </Form>
        </Container>
    )
}

export default Login;