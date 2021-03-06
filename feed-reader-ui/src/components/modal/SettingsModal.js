import { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import FeedSource from '../FeedSource';
import {
  Col,
  Container,
  Form,
  Modal,
  Button,
  Row,
  FloatingLabel,
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 * This component contains the logic behind deleting sources from the database,
 * subscribing, adding source to the database through a url
 */

export const SettingsModal = (props) => {
  const [feedSources, setFeedSources] = useState([]);
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(null);
  const user = useSelector((state) => state.currentUser, shallowEqual);

  useEffect(() => {
    setLoading(true);
    loadUser();
    loadFeedSources();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    addFeedSource(url);
  };

  const handleUrlWrite = (e) => {
    setUrl(e.target.value);
  };

  const handleSubscribe = async (id) => {
    setLoading(true);
    let subscriptionForm = {
      username: user.username,
      feedSourceId: id,
    };
    await fetch('http://localhost:9091/api/subscriptions/feed/subscribe', {
      method: 'POST',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscriptionForm),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Request failed');
        }
        setTimeout(loadFeedSources, 300);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleUnsubscribe = async (id) => {
    setLoading(true);
    let subscriptionForm = {
      username: user.username,
      feedSourceId: id,
    };
    await fetch('http://localhost:9091/api/subscriptions/feed/unsubscribe', {
      method: 'POST',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscriptionForm),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Request failed');
        }
        setTimeout(loadFeedSources, 300);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const loadUser = async () => {
    if (!user.username) {
      return [];
    }
    let response = await fetch(
      `http://localhost:9091/api/subscriptions/authenticated/${user.username}`,
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      },
    );
    let data = await response.json();
    setSubscribed(data.subscription.isSubscibed);
  };

  const loadFeedSources = async () => {
    let response = await fetch('http://localhost:9090/api/feeds', {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
    let data = await response.json();
    let userSources = await loadUSerFeedSources();
    setFeedSources(
      data
        .map((feedSource) => {
          feedSource.subscribed = userSources.find(
            (userSource) => userSource.feedSourceId.id === feedSource.id.id,
          )
            ? true
            : false;
          return feedSource;
        })
        .sort((a, b) => b.subscribers - a.subscribers),
    );
    setLoading(false);
  };

  const loadUSerFeedSources = async () => {
    if (!user.username) {
      return [];
    }
    let response = await fetch(
      `http://localhost:9091/api/subscriptions/${user.username}`,
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      },
    );
    let data = await response.json();
    return data;
  };

  const addFeedSource = async (url) => {
    setLoading(true);
    let newFeedSource = { url };
    fetch('http://localhost:9090/api/feeds', {
      method: 'POST',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newFeedSource),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Request failed');
        }
        return response.json();
      })
      .then((data) => {
        setFeedSources([...feedSources, data]);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const removeFeedSource = async (id) => {
    await fetch(`http://localhost:9090/api/feeds/${id}`, {
      method: 'DELETE',
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Request failed');
        } else {
          setFeedSources(feedSources.filter((v) => v.id.id !== id));
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const listSources = () => {
    return feedSources.length === 0 ? (
      <p>There are no sources</p>
    ) : (
      feedSources.map((fs) => (
        <FeedSource
          key={fs.id.id}
          feedSource={fs}
          subbed={subscribed}
          handleSubscribe={handleSubscribe}
          handleUnsubscribe={handleUnsubscribe}
          removeFeedSource={removeFeedSource}
          loading={loading}
        />
      ))
    );
  };

  return (
    <>
      <Modal
        size="xl"
        fullscreen={true}
        show={props.show}
        onHide={props.handleClose}
      >
        <Container className="h-100">
          <Modal.Header closeButton>
            <Modal.Title>Settings</Modal.Title>
          </Modal.Header>
          <Modal.Body className="h-75 overflow-auto mb-2">
            <Container className="overflow-auto h-100">
              {listSources()}
            </Container>
          </Modal.Body>
          <Modal.Footer>
            <Container>
              <Form onSubmit={handleSubmit} className="w-100">
                <Form.Group className="mt-3 h-100" controlId="formBasicEmail">
                  <Row className="mt-2">
                    <Col className="align-items-center">
                      <FloatingLabel
                        controlId="floatingInput"
                        label="URL"
                        className="mb-3"
                      >
                        <Form.Control
                          type="text"
                          onChange={handleUrlWrite}
                          value={url}
                          placeholder="https://someUrl/rss.xml"
                        />
                      </FloatingLabel>
                    </Col>
                    <Col className="h-100 align-items-center p-1" md="1">
                      <Button
                        variant="primary"
                        size="lg"
                        className="h-100"
                        type="submit"
                        disabled={loading}
                      >
                        <FontAwesomeIcon icon={faPlusCircle} />
                      </Button>
                    </Col>
                  </Row>
                </Form.Group>
              </Form>
            </Container>
          </Modal.Footer>
        </Container>
      </Modal>
    </>
  );
};

// export default SettingsModal;
