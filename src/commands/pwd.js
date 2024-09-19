import { getCurrentPath } from '../components/FileSystem';

const pwd = () => {
  return getCurrentPath();
};

export default pwd;