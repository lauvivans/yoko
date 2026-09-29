import DefaultButton from '@/components/action/DefaultButton';

interface NotFoundProps {
  handleCreate?: () => void;
  keyword: string;
  type?: 'no-data' | 'filter-no-data';
}

const NotFound = ({
  handleCreate,
  keyword,
  type = 'no-data',
}: NotFoundProps) => {
  return (
    <div className="c-not-found">
      {type === 'no-data' && (
        <div>
          <p>
            It appears you haven&apos;t created any {keyword} yet. Click in{' '}
            <span className="c-not-found__highlight">
              &apos;Create {keyword}&apos;
            </span>{' '}
            to create.
          </p>
          <DefaultButton
            onClick={handleCreate}
          >{`Create ${keyword}`}</DefaultButton>
        </div>
      )}
      {type === 'filter-no-data' && (
        <p className="c-not-found__filter-no-data">
          No {keyword} were found with the applied filters
        </p>
      )}
    </div>
  );
};

export default NotFound;
