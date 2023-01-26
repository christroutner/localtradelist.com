/*
  This View allows the user to update the mutable data associated with the token,
  which is in-turn controlled by the wallet (12 words).
*/

// Global npm libraries
import React from 'react'
import { Container, Row, Col, Tabs, Tab } from 'react-bootstrap'

// Local libraries
import EditRawJson from './edit-raw-json.js'

function EditMutableData (props) {
  return (
    <>
      <Container>
        <Row>
          <Col>
            <Tabs
              defaultActiveKey='products'
            >
              <Tab eventKey='products' title='Products'>
                <p>This tab will be a visual way to edit products</p>
              </Tab>
              <Tab eventKey='json' title='JSON'>
                <EditRawJson appData={props.appData} />
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default EditMutableData
