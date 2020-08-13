import firebase from 'firebase/app';
import 'firebase/firestore';

// get firestore instance
export const db = firebase
    .initializeApp({ projectId: 'commissions-cs-bot'})
    .firestore();

// export types that exist in Firestore
// might not be necessary, but super helpful
const { Timestamp, GeoPoint } = firebase.firestore;
export { Timestamp, GeoPoint };