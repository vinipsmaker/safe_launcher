var ref = require('ref');
var uuid = require('uuid');
var util = require('./util.js');
var ArrayType = require('ref-array');
var IntArray = ArrayType(ref.types.int);
var VoidHandle = ref.types.void;
var voidHandlePtr = ref.refType(VoidHandle);
var voidHandlePtrPtr = ref.refType(voidHandlePtr);
var writerHandlePool = {};

var createPayload = function(action, request) {
  var payload = {
    'module': 'nfs',
    'action': action,
    'safe_drive_dir_key': request.safeDriveKey,
    'app_dir_key': request.appDirKey,
    'safe_drive_access': request.hasSafeDriveAccess || false,
    'data': {}
  };
  /*jscs:disable requireCamelCaseOrUpperCaseIdentifiers*/
  if (request.params.hasOwnProperty('dirPath')) {
    payload.data.dir_path = request.params.dirPath;
  }
  if (request.params.hasOwnProperty('filePath')) {
    payload.data.file_path = request.params.filePath;
  }
  if (request.params.hasOwnProperty('isPrivate')) {
    payload.data.is_private = request.params.isPrivate;
  }
  if (request.params.hasOwnProperty('isVersioned')) {
    payload.data.is_versioned = request.params.isVersioned;
  }
  if (request.params.hasOwnProperty('userMetadata')) {
    payload.data.user_metadata = request.params.userMetadata;
  }
  if (request.params.hasOwnProperty('isPathShared')) {
    payload.data.is_path_shared = request.params.isPathShared;
  }
  /*jscs:enable requireCamelCaseOrUpperCaseIdentifiers*/
  return payload;
};

var createNewValuesPayload = function(newValues) {
  var payload = {};
  /*jscs:disable requireCamelCaseOrUpperCaseIdentifiers*/
  if (newValues.hasOwnProperty('name')) {
    payload.name = newValues.name;
  }
  if (newValues.hasOwnProperty('userMetadata')) {
    payload.user_metadata = newValues.userMetadata;
  }
  if (newValues.hasOwnProperty('content')) {
    payload.content = newValues.content;
  }
  /*jscs:enable requireCamelCaseOrUpperCaseIdentifiers*/
  return payload;
};

var createDirectory = function(lib, request) {
  try {
    var payload = createPayload('create-dir', request);
    util.execute(lib, request.client, request.id, payload);
  } catch (e) {
    util.sendError(request.id, 999, e.toString());
  }
};

var getDirectory = function(lib, request) {
  try {
    var payload = createPayload('get-dir', request);
    util.executeForContent(lib, request.client, request.id, payload);
  } catch (e) {
    util.sendError(request.id, 999, e.toString());
  }
};

var deleteDirectory = function(lib, request) {
  try {
    var payload = createPayload('delete-dir', request);
    util.execute(lib, request.client, request.id, payload);
  } catch (e) {
    util.sendError(request.id, 999, e.toString());
  }
};

var modifyDirectory = function(lib, request) {
  try {
    var payload = createPayload('modify-dir', request);
    /*jscs:disable requireCamelCaseOrUpperCaseIdentifiers*/
    payload.data.new_values = createNewValuesPayload(request.params.newValues);
    /*jscs:enable requireCamelCaseOrUpperCaseIdentifiers*/
    util.execute(lib, request.client, request.id, payload);
  } catch (e) {
    util.sendError(request.id, 999, e.toString());
  }
};

var createFile = function(lib, request) {
  try {
    var payload = createPayload('create-file', request);
    util.execute(lib, request.client, request.id, payload);
  } catch (e) {
    util.sendError(request.id, 999, e.toString());
  }
};

var deleteFile = function(lib, request) {
  try {
    var payload = createPayload('delete-file', request);
    util.execute(lib, request.client, request.id, payload);
  } catch (e) {
    util.sendError(request.id, 999, e.toString());
  }
};

var modifyFileMeta = function(lib, request) {
  try {
    var payload = createPayload('modify-file', request);
    /*jscs:disable requireCamelCaseOrUpperCaseIdentifiers*/
    payload.data.new_values = createNewValuesPayload(request.params.newValues);
    /*jscs:enable requireCamelCaseOrUpperCaseIdentifiers*/
    util.execute(lib, request.client, request.id, payload);
  } catch (e) {
    util.sendError(request.id, 999, e.toString());
  }
};

var modifyFileContent = function(lib, request) {
  try {
    var payload = createPayload('modify-file', request);
    /*jscs:disable requireCamelCaseOrUpperCaseIdentifiers*/
    payload.data.new_values = createNewValuesPayload(request.params.newValues);
    /*jscs:enable requireCamelCaseOrUpperCaseIdentifiers*/
    util.execute(lib, request.client, request.id, payload);
  } catch (e) {
    util.sendError(request.id, 999, e.toString());
  }
};

var getFile = function(lib, request) {
  try {
    var payload = createPayload('get-file', request);
    payload.data.offset = request.params.offset;
    payload.data.length = request.params.length;
    /*jscs:disable requireCamelCaseOrUpperCaseIdentifiers*/
    payload.data.include_metadata = request.params.includeMetadata;
    /*jscs:enable requireCamelCaseOrUpperCaseIdentifiers*/
    util.executeForContent(lib, request.client, request.id, payload);
  } catch (e) {
    util.sendError(request.id, 999, e.toString());
  }
};

var getFileMetadata = function(lib, request) {
  try {
    var payload = createPayload('get-file-metadata', request);
    util.executeForContent(lib, request.client, request.id, payload);
  } catch (e) {
    util.sendError(request.id, 999, e.toString());
  }
};

var move = function(lib, request, action) {
  try {
    var payload = createPayload(action, request);
    /*jscs:disable requireCamelCaseOrUpperCaseIdentifiers*/
    payload.data.src_path = request.params.srcPath;
    payload.data.is_src_path_shared = request.params.isSrcPathShared;
    payload.data.dest_path = request.params.destPath;
    payload.data.is_dest_path_shared = request.params.isDestPathShared;
    payload.data.retain_source = request.params.retainSource;
    /*jscs:enable requireCamelCaseOrUpperCaseIdentifiers*/
    util.execute(lib, request.client, request.id, payload);
  } catch (e) {
    util.sendError(request.id, 999, e.toString());
  }
};

var getWriter = function(lib, request) {
  try {
    var payload = createPayload(request.action, request);
    var writerHandle = ref.alloc(voidHandlePtrPtr);
    /*jscs:disable requireCamelCaseOrUpperCaseIdentifiers*/
    var result = lib.get_nfs_writer(JSON.stringify(payload), request.client, writerHandle);
    /*jscs:enable requireCamelCaseOrUpperCaseIdentifiers*/
    if (result !== 0) {
      return util.sendError(request.id, result);
    }
    var writerId = uuid.v4();
    writerHandlePool[writerId] = writerHandle;
    util.send(request.id, writerId);
  } catch (e) {
    util.sendError(request.id, 999, e.message);
  }
};

var write = function(lib, request) {
  try {
    util.send('log', '');
    var writerId = request.params.writerId;
    util.send('log', { level: 'DEBUG', msg: ('FFI/mod/nfs.js - ' + writerId) });
    if (!writerHandlePool.hasOwnProperty(writerId)) {
      return util.sendError(request.id, 999, 'Writer not found');
    }
    util.send('log', { level: 'DEBUG', msg: 'FFI/mod/nfs.js - write found' });
    var offset = request.params.offset || 0;
    util.send('log', { level: 'DEBUG', msg: ('FFI/mod/nfs.js - going to write ' + offset) });
    /*jscs:disable requireCamelCaseOrUpperCaseIdentifiers*/
    var result = lib.nfs_stream_write(writerHandlePool[writerId], offset, IntArray.untilZeros(new Buffer(request.params.data, 'base64')));
    /*jscs:enable requireCamelCaseOrUpperCaseIdentifiers*/
    util.send('log', { level: 'DEBUG', msg: ('FFI/mod/nfs.js - Write res ' + result) });
    if (result === 0) {
      return util.send(request.id);
    }
    util.sendError(request.id, result);
  } catch (e) {
    util.send('log', { level: 'DEBUG', msg: ('FFI/mod/nfs.js - ERR ' + e.toString()) });
    util.sendError(request.id, 999, e.toString());
  }
};

var closeWriter = function(lib, request) {
  try {
    var writerId = request.params.writerId;
    if (!writerHandlePool.hasOwnProperty(writerId)) {
      return util.sendError(request.id, 999, 'Writer not found');
    }
    /*jscs:disable requireCamelCaseOrUpperCaseIdentifiers*/
    var result = lib.nfs_stream_close(writerHandlePool[writerId]);
    /*jscs:enable requireCamelCaseOrUpperCaseIdentifiers*/
    if (result === 0) {
      return util.send(request.id);
    }
    util.sendError(request.id, result);
  } catch (e) {
    util.sendError(request.id, 999, e.toString());
  }
};

exports.execute = function(lib, request) {
  switch (request.action) {
    case 'create-dir':
      createDirectory(lib, request);
      break;
    case 'get-dir':
      getDirectory(lib, request);
      break;
    case 'delete-dir':
      deleteDirectory(lib, request);
      break;
    case 'modify-dir':
      modifyDirectory(lib, request);
      break;
    case 'create-file':
      createFile(lib, request);
      break;
    case 'delete-file':
      deleteFile(lib, request);
      break;
    case 'modify-file-meta':
      modifyFileMeta(lib, request);
      break;
    case 'get-file':
      getFile(lib, request);
      break;
    case 'get-file-metadata':
      getFileMetadata(lib, request);
      break;
    case 'modify-file-content':
      modifyFileContent(lib, request);
      break;
    case 'move-dir':
      move(lib, request, 'move-dir');
      break;
    case 'move-file':
      move(lib, request, 'move-file');
      break;
    case 'get-writer':
      getWriter(lib, request);
      break;
    case 'write':
      write(lib, request);
      break;
    case 'close-writer':
      closeWriter(lib, request);
      break;
    default:
      util.sendError(request.id, 999, 'Invalid action');
  }
};
