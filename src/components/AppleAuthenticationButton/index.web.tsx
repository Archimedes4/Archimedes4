/*
  UTTT
  Andrew Mainella
  May 31 2024
*/
import { OAuthProvider, signInWithCredential } from 'firebase/auth';
import { useMemo } from 'react';
import AppleSignin from 'react-apple-signin-auth';
import { auth } from '../../app/_layout';

/** Apple Signin button */
export default function AppleAuthenticationButton() {
  let nonce = useMemo(() => Math.random().toString(36).substring(2, 10), []);
  return (
  <AppleSignin
    authOptions={{
      clientId: 'com.Archimedes4.UTTT',
      scope: 'email',
      redirectURI: 'https://archimedes4-games.web.app/account',
      state: 'signin',
      nonce: Math.random().toString(36).substring(2, 10),
      usePopup: true,
    }}
    uiType="dark"
    className="apple-auth-btn"
    onSuccess={async (e: any) => {
      try {
        const { id_token } = e;
        const provider = new OAuthProvider('apple.com');
        const credential = provider.credential({
            idToken: id_token,
            rawNonce: nonce
        });
        await signInWithCredential(auth, credential);
        // signed in
      } catch (e: unknown) {
        if (typeof e === 'object' && e !== null && 'code' in e && e.code === 'ERR_REQUEST_CANCELED') {
          // handle that the user canceled the sign-in flow
        } else {
          // handle other errors
        }
      }
    }}
    onError={() => {

    }}
  />
)}
