import { Outlet } from 'react-router';

/*eslint-disable sonarjs/no-commented-code*/
const LoginLayout = () => {
  // const navigate = useNavigate();
  return (
    <main className="login">
      <div>
        {/* <img src="/mascot.svg" onClick={() => navigate(paths.home)} /> */}

        <Outlet />
      </div>
    </main>
  );
};
/*eslint-enable sonarjs/no-commented-code*/

export default LoginLayout;
