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
              <b>
                Local Trade List is a platform to help neighbors trade with neighbors.
              </b>
            </p>

            <p>
              <a href="https://docs.localtradelist.com">
                Find out more at the documentation site.
              </a>
            </p>

            <h3>Overview</h3>
            <p>
              Many of the social problems in the world today are due to centralization.
              People who rely on big corporate stores like Walmart and Amazon are
              easy targets for manipulation from State actors. People who can meet
              their needs locally, through trade with their local community, make a
              much more difficult target for State actors to manipulate and coerce.
              The goal of this app is help people find one another in their local
              community to trade with.
            </p>

            <p>
              Blockchains are just a new form of a database. They are inefficient
              databases by Web 2.0 standard, but their main advantage are:
            </p>
            <ul>
              <li>Permissionless: no login names or permission required to update the database</li>
              <li>Censorship Resistence: users can not be de-platformed, content can not be deleted</li>
              <li>Tamper Proof: No one can alter old data, and any updates provide a chain of custody</li>
            </ul>
            <p>
              These features of a blockchain are great for rural communities. If you
              have some Bitcoin Cash (BCH), no one can stop you from writing data
              to the blockchain. No one can stop you from advertising the
              goods you want to offer for trade. No one can deplatform you, or
              directly manipulate your data.
            </p>

            <p>
              For example, no one can stop you from advertising and selling goods
              such as unpasteurized milk or non-USDA certified food. These are examples
              of items that are banned for sale from sites like Craigslist, Facebook
              Marketplace, and other similar platforms. This site is also not
              restricted to a single country or legal jurisdiction. It is inherently
              international, just like the internet and Bitcoin protocol are.
            </p>

            <p>
              Local Trade List is also an experiment in group moderation. Explicit
              stores can be flagged as 'Not Safe For Work' (NSFW) by any user. 'Garbage'
              entries can be flagged as such. If enough people flag content, the
              website will hide the data from the map. Website operators only
              choose the thresholds for when this group action is recognized.
            </p>
            <p>
              Flagged stores are not deleted (that
              is impossible), the data is simply not shown. Anyone is free to fork this
              website and set different thresholds for moderation policy. It is
              hoped that one day many versions of this app will exist among different
              communities, in different niches, with different moderation
              preferences. They can all pull
              the data from the same blockchain, but display it differently depending
              on the preferences of their user community.
            </p>
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
