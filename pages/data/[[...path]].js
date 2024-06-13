import DataPageLegacy, {getServerSideProps as getServerSidePropsLegacy} from './data-legacy'
import DataPageS3, {getServerSideProps as getServerSidePropsS3} from './data-s3'

const {NEXT_PUBLIC_TOGGLER_DATA_SOURCES} = process.env
const getServerSideProps = NEXT_PUBLIC_TOGGLER_DATA_SOURCES === 'S3' ? getServerSidePropsS3 : getServerSidePropsLegacy
const DataPage = NEXT_PUBLIC_TOGGLER_DATA_SOURCES === 'S3' ? DataPageS3 : DataPageLegacy

export {getServerSideProps}
export default DataPage
