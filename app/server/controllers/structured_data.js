import sessionManager from '../session_manager';
import {ResponseError, ResponseHandler} from '../utils';
import structuredData from '../../ffi/api/structured_data';
import dataId from '../../ffi/api/dataId';
import { ENCRYPTION_TYPE } from '../../ffi/model/enum';

const API_ACCESS_NOT_GRANTED = 'Low level api access is not granted';
const UNAUTHORISED_ACCESS = 'Unauthorised access';
const HANDLE_ID_KEY = 'Handle-Id';
const ID_LENGTH = 32;

const TAG_TYPE = {
  UNVERSIONED: 500,
  VERSIONED: 501
};

const createOrUpdate = (req, res, next, isCreate = true) => {
  const sessionInfo = sessionManager.get(req.headers.sessionId);
  if (!sessionInfo) {
    return next(new ResponseError(401, UNAUTHORISED_ACCESS));
  }
  const app = sessionInfo.app;
  if (!app.permission.lowLevelAccess) {
    return next(new ResponseError(403, API_ACCESS_NOT_GRANTED));
  }
  const id = new Buffer(req.params.id, 'base64');
  if (!id || id.length !== ID_LENGTH) {
    return next(new ResponseError(400, 'Invalid id specified'));
  }
  let tagType = req.headers['tag-type'] || TAG_TYPE.UNVERSIONED;
  if (isNaN(tagType)) {
    return next(new ResponseError(400, 'Tag type must be a valid number'));
  }
  tagType = parseInt(tagType)
  if (!(tagType === TAG_TYPE.UNVERSIONED || tagType === TAG_TYPE.VERSIONED || tagType >= 15000)) {
    return next(new ResponseError(400, 'Invalid tag type specified'));
  }
  let encryptionType = ENCRYPTION_TYPE.PLAIN;
  if (req.headers['encryption'] && !ENCRYPTION_TYPE[req.headers['encryption'].toUpperCase()]) {
    return next(new ResponseError(400, 'Invalid encryption type specified'));
  } else {
    encryptionType = ENCRYPTION_TYPE[req.headers['encryption'].toUpperCase()];
  }
  let publicKeyHandle;
  if (encryptionType === ENCRYPTION_TYPE.HYBRID) {
    if (!res.headers['public-key']) {
      return next(new ResponseError(400, 'Public key handle is not present in the header'));
    }
    if (isNaN(res.headers['public-key'])) {
      return next(new ResponseError(400, 'Public key handle is not a valid number'));
    }
    publicKeyHandle = parseInt(res.headers['public-key']);
  }
  let data = null;
  if (req.body && req.body.length > 0) {
    data = req.body;
  }
  const exec = async () => {
    const responseHandler = new ResponseHandler(req, res);
    try {
      let handleId;
      if (isCreate) {
        handleId = await structuredData.create(app, id, typeTag, encryptionType, data, publicKeyHandle);
      } else {
        handleId = await structuredData.update(app, req.params.handleId, encryptionType, data);
      }
      res.set(HANDLE_ID_KEY, handleId);
      res.sendStatus(200);
    } catch(e) {
      responseHandler(e);
    }
  };
  exec();
};

// POST /{id}
export create = (req, res, next) => {
  createOrUpdate(req, res, next, true);
};


// GET /handle/{id}
export getHandle =  (req, res, next) => {
  const sessionInfo = sessionManager.get(req.headers.sessionId);
  const app = sessionInfo ? sessionInfo.app : null;
  const id = new Buffer(req.params.id, 'base64');
  if (!id || id.length !== ID_LENGTH) {
    return next(new ResponseError(400, 'Invalid id specified'));
  }
  let tagType = req.headers['tag-type'] || TAG_TYPE.UNVERSIONED;
  if (isNaN(tagType)) {
    return next(new ResponseError(400, 'Tag type must be a valid number'));
  }
  tagType = parseInt(tagType)
  if (!(tagType === TAG_TYPE.UNVERSIONED || tagType === TAG_TYPE.VERSIONED || tagType >= 15000)) {
    return next(new ResponseError(400, 'Invalid tag type specified'));
  }
  const exec = async () => {
    const responseHandler = new ResponseHandler(req, res);
    try {
      const result = await dataId.getStructuredDataHandle(tagType, id);
      // res.set('Is-Owner', result.isOwner);
      res.set(HANDLE_ID_KEY, result.handleId);
      res.sendStatus(200);
    } catch(e) {
      responseHandler(e);
    }
  };
  exec();
};

// PUT /{handleId}
export update = (req, res, next) => {
  createOrUpdate(req, res, next, false);
};

// GET /{handleId}
export read = (req, res, next) => {
  const sessionInfo = sessionManager.get(req.headers.sessionId);
  const app = sessionInfo ? sesssionInfo.app : null;
  const exec = async () => {
    const responseHandler = new ResponseHandler(req, res);
    try {
      const data = await structuredData.read(app, handleId);
      responseHandler(null, data);
    } catch (e) {
      responseHandler(e);
    }
  };
  exec();
};

// DELETE /handle/id
export dropHandle = (req, res, next) => {
  const sessionInfo = sessionManager.get(req.headers.sessionId);
  if (!sessionInfo) {
    return next(new ResponseError(401, UNAUTHORISED_ACCESS));
  }
  const app = sessionInfo.app;
  if (!app.permission.lowLevelAccess) {
    return next(new ResponseError(403, API_ACCESS_NOT_GRANTED));
  }
  const responseHandler = new ResponseHandler(req, res);
  dataId.dropHandle(req.params.handleId)
    .then(responseHandler, responseHandler, console.error);
};
