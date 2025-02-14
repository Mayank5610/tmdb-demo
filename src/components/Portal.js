import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { injectUsingPortal, portalIdExist } from '../common/constants';

const Portal = ({ children, portalId }) => {
  const [portalExist, setPortalExist] = useState(false);

  useEffect(() => {
    if (portalIdExist(portalId)) {
      setPortalExist(true);
    } else {
      setPortalExist(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {portalExist &&
        ReactDOM.createPortal(children, injectUsingPortal(portalId))}
    </>
  );
};

export default Portal;
