import dynamic from 'next/dynamic';

const LazyBlockText = dynamic(() => import('components/BlockText'), {
  ssr: false,
});

export default LazyBlockText;
