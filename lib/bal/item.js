export default function getStatus(item) {
  let status = null

  if (item.edited) {
    status = 'edited'
  }

  if (item.deleted) {
    status = 'deleted'
  }

  if (item.created) {
    status = 'created'
  }

  return status
}
