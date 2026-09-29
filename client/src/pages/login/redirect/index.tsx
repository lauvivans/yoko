import { useEffect } from 'react';

/*eslint-disable sonarjs/no-commented-code*/
const LoginRedirect = () => {
  // const navigate = useNavigate();

  useEffect(() => {
    const completeSignIn = async () => {
      // if (isSignInWithEmailLink(auth, window.location.href)) {
      //   const email = window.localStorage.getItem('emailForSignIn');
      //   try {
      //     await signInWithEmailLink(auth, email!, window.location.href);
      //     window.localStorage.removeItem('emailForSignIn');
      //     setTimeout(() => {
      //       // eslint-disable-next-line @typescript-eslint/no-floating-promises
      //       navigate('/');
      //     }, 1000);
      //   } catch (error) {
      //     console.error(error);
      //   }
      // }
    };

    void completeSignIn();
  }, []);

  return (
    <>
      <h3> Yay! You&apos;re signed in</h3>
      <p>Redirecting...</p>
    </>
  );
};
/*eslint-enable sonarjs/no-commented-code*/

export default LoginRedirect;
