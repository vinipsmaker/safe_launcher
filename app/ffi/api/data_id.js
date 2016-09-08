import ref from 'ref';

import FfiApi from '../ffi_api';

const int32 = ref.types.int32;
const u64 = ref.types.uint64;
const u8 = ref.types.uint8;
const u8Pointer = ref.refType(u8);
const u64Pointer = ref.refType(u64);

class DataId extends FfiApi {

  constructor() {
    super();
  }

  getFunctionsToRegister() {
    return {
      'data_id_new_struct_data': [int32, [u64, u8Pointer, u64Pointer]],
      'data_id_free': [int32, [u64]]
    };
  }

  dropHandle(handleId) {
    const self = this;
    const executor = async (resolve, reject) => {
      const onResult = (err, res) => {
        if (err || res !== 0) {
          return reject(err || res);
        }
        resolve();
      };
      self.safeCore.data_id_free.async(handleId, onResult);
    };
    return new Promise(executor);
  }

  getStructuredDataHandle(id, typeTag) {
    const self = this;
    const executor = (reject, resolve) => {
      const handleRef = ref.alloc(u8P);
      const onResult = (err, res) => {
        if (err || res !== 0) {
          return reject(err || res);
        }
        resolve(handleRef.deref());
      };
      self.safeCore.data_id_new_struct_data(typeTag, id, handleRef, onResult);
    };
    return new Promise(executor);
  }

}

const dataId = new DataId();
export default dataId;
