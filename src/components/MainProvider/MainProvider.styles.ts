import { createStyles } from '@mantine/core';

export default createStyles(() => ({
  boxBorder: {
    padding: 50,
    borderRadius: 40,
    border: '1px solid gray',
  },
  wrapper: {
    minHeight: `calc(100vh - 165px)`, // 100% viewport height - 150px for the header&footer
  },
}));
