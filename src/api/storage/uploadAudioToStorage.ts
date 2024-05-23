import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

import { storage } from '@myfirebase/config';

export const uploadAudioToStorage = async (
  audioBlob: Blob,
  userUID: string
): Promise<string> => {
  const metadata = {
    contentType: 'audio/webm',
  };

  const storageRef = ref(storage, `audio/webm/${userUID}/${uuidv4()}.webm`);
  await uploadBytes(storageRef, audioBlob, metadata);
  const downloadURL = await getDownloadURL(storageRef);

  return downloadURL;
};
