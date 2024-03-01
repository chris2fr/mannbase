/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ns9rzw8zxocaqch")

  collection.listRule = "@request.auth.id = user.consultations.id"
  collection.viewRule = "@request.auth.id = user.consultations.id"
  collection.createRule = ""
  collection.updateRule = "@request.auth.id = user.consultations.id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ns9rzw8zxocaqch")

  collection.listRule = null
  collection.viewRule = null
  collection.createRule = null
  collection.updateRule = null

  return dao.saveCollection(collection)
})
