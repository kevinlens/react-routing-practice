import { useParams, Route, Link, useRouteMatch } from 'react-router-dom';
import Comments from '../components/comments/Comments';
import { useEffect, useState } from 'react';
import useHttp from '../hooks/use-http';
import HighlightedQuote from '../components/quotes/HighlightedQuote';
import { getSingleQuote } from '../lib/api';
import LoadingSpinner from '../components/UI/LoadingSpinner';
const QuoteDetail = () => {
  const [showComments, setShowComments] = useState(false);
  const params = useParams();
  const match = useRouteMatch();
  const { quoteId } = params;
  const {
    sendRequest,
    status,
    data: loadedQuote,
    error,
  } = useHttp(getSingleQuote, true);

  useEffect(() => {
    sendRequest(quoteId);
  }, [sendRequest, quoteId]);

  if (status === 'pending') {
    return (
      <div className='centered'>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <p className='centered'>{error}</p>;
  }

  if (!loadedQuote.text) {
    return <p>No quote found!</p>
  }

  const commentsDisplayHandler = () => {
    setShowComments((prevComments) => !prevComments);
  };

  let commentsButton = '';
  if (showComments) {
    commentsButton = (
      <Link
        to={`${match.url}`}
        onClick={commentsDisplayHandler}
        className='btn--flat'
      >
        Hide Comments
      </Link>
    );
  } else {
    commentsButton = (
      <Link
        to={`${match.url}/comments`}
        onClick={commentsDisplayHandler}
        className='btn--flat'
      >
        Show Comments
      </Link>
    );
  }

  return (
    <section>
      <HighlightedQuote text={loadedQuote.text} author={loadedQuote.author} />
      <div className='centered'>{commentsButton}</div>
      {/* path={`/quotes/${params.quoteId}/comments`} */}
      <Route path={`${match.path}/comments`}>
        <Comments />
      </Route>
    </section>
  );
};

export default QuoteDetail;
