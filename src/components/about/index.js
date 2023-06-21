/*
  The about page describes the current app.
*/

// Global npm libraries
import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

function About (props) {
  return (
    <>
      <Container>
        <Row>
          <Col>
            <h2>About LocalTradeList.com</h2>

            <p>
              Have a bumper crop of potatoes? Drop a pin on the map and let your
              neighbors know. Did your cat just have kittens and they need a
              good home? Put it on the map. Looking for a local farmer to buy
              food from? Check the map!
            </p>

            <p>
              <b>
                Local Trade List is a platform to help neighbors trade with
                neighbors. The goal of the app is to make it easy and fun to
                trade with the people around you.
              </b>
            </p>

            <p>
              <a href='https://docs.localtradelist.com' target='blank' rel='noreferrer'>
                Find out more at the documentation site.
              </a>
            </p>

            <h3>What makes Local Trade List different?</h3>
            <p>
              There are several map-based apps out there for freedom-focused
              communities. So what makes Local Trade List different? Our app
              has two high-level goals:
            </p>

            <ul>
              <li>
                Make the user interface easy and fun to use.
              </li>
              <li>
                Use blockchain technology to eliminate the threat of deplatforming.
              </li>
            </ul>

            <p>
              The focus on blockchain technology is what really sets this app apart
              from others like it. All data on the map is anchored in a blockchain.
              That means data can never be deleted, and censorship is impossible.
              Anyone can run their own copy of Local Trade List for their local
              community. No one can stop them, no one can tamper with their data,
              and no one can deplatform anyone. However, there is room for
              community moderation. It's a delicate balance.{' '}
              <a href='https://docs.localtradelist.com/docs/technology/architecture#group-moderation' target='blank' rel='noreferrer'>
                Learn more about our integration of blockchain with this application.
              </a>
            </p>

            <h3>Support</h3>
            <p>
              Local Trade List is an open source software project, running open
              protocols, on open networks. There is no central organization
              behind it, but there are chat rooms where the community of users
              and software developers congregate. We welcome you to ask questions
              and participate in our community!
            </p>
            <ul>
              <li>
                <a href='https://t.me/sji_freedom_cell'>
                  Telegram Chat Channel
                </a>
              </li>
              <li>
                <a href='https://chat.psfoundation.info/channel/40e7cc7d0e5f16c393aa5f8fa014c2df756972019d6b16dba17264abd91793b3' target='_blank' rel='noreferrer'>
                  Nostr Chat Channel
                </a>
              </li>
            </ul>

          </Col>
        </Row>

        <Row>
          <Col>
            <h2>Source Code</h2>
            <p>
              The source code that powers this website can be found in the
              following locations:
            </p>
            <ul>
              <li>
                Front End Web App:{' '}
                <a href='https://github.com/christroutner/localtradelist.com' target='_blank' rel='noreferrer'>
                  localtradelist.com GitHub Repository
                </a>
              </li>
              <li>
                Back End REST API:{' '}
                <a href='https://github.com/Permissionless-Software-Foundation/ssp-api' target='_blank' rel='noreferrer'>
                  ssp-api GitHub Repository
                </a>
              </li>
              <li>
                Simple Store Protocol Indexer:{' '}
                <a href='https://github.com/Permissionless-Software-Foundation/psf-slp-indexer/tree/ssp' target='_blank' rel='noreferrer'>
                  psf-slp-indexer GitHub Repository, ssp branch
                </a>
              </li>
              <li>
                Blockchain Infrastructure:{' '}
                <a href='https://cashstack.info' target='_blank' rel='noreferrer'>
                  The Cash Stack
                </a>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default About
