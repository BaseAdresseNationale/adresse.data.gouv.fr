export default function getStatus(item) {
  let status = null

  if (item.created) {
    status = 'created'
  }

  if (item.edited) {
    status = 'edited'
  }

  if (item.deleted) {
    status = 'deleted'
  }

  return status
}
