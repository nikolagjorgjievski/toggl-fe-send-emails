import { render } from '@testing-library/react';
import FileUploadComponent from '../components/FileUploadComponent'

it('should render the component', () => {
  const { getByText } = render(
    <FileUploadComponent setLoadedFiles={() => {}} setLoading={() => {}} />
  );
  expect(getByText('Click to select files, or drag and drop them here')).toBeInTheDocument();
});
