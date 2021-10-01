import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { shallowEqual, useSelector } from 'react-redux';
import FeedSource from '../FeedSource';

//TODO: Rework the feed sources page
const FeedSourcePage = () => {
  const [feedSources, setFeedSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.currentUser, shallowEqual);

  useEffect(() => {
    setLoading(true);
    loadFeedSources();
  }, []);
  

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
          subbed={user.subscribed}
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
      <Container className="py-5">
        <Container style={{ height: '70vh' }} className="overflow-auto">
          {listSources()}
        </Container>
      </Container>
    </>
  );
};

export default FeedSourcePage;
