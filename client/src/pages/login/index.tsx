const Login = () => {
  /* eslint-disable @typescript-eslint/require-await */
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;

    if (!email) return;
  };
  /* eslint-enable @typescript-eslint/require-await */

  return (
    <>
      <div>
        <h3>Yoko welcomes you</h3>
        <p>Your events and actions tracker</p>
      </div>

      <form onSubmit={(e) => void handleSubmit(e)}>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="example@mail.com"
        />
        {/* <Button type="submit">Sign in with email</Button> */}
      </form>

      <div>
        <span>Sign in with google instead</span>
        {/* <Button onClick={signInWithGoogle}>Google</Button> */}
      </div>
    </>
  );
};

export default Login;
