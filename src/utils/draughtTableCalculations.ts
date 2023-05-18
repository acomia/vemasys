import {useSettings} from '@bluecentury/stores'

type TableItem = {
  draught: number
  tonnage: number
}

export const calculateTable = (
  tonnageMax: number,
  tonnageMin: number,
  draughtMax: number,
  draughtMin: number
): TableItem[] => {
  const tonnageToOneCmDraught =
    (tonnageMax - tonnageMin) / (draughtMax - draughtMin)
  const draughtDifference = draughtMax - draughtMin
  const cmArray = Array.from(
    Array(draughtDifference + 1),
    (x, i) => i + draughtMin
  )
  const tableData = (
    tonnageDraught: number,
    draughts: number[]
  ): TableItem[] => {
    return draughts.map((item, index) => {
      const tonnage = tonnageMin + tonnageDraught * index
      return {
        draught: item,
        tonnage: Math.round(tonnage * 1000) / 1000,
      }
    })
  }
  return tableData(tonnageToOneCmDraught, cmArray)
}

export const recalculateTable = (
  changedDraughtArray: TableItem[],
  dataArray: TableItem[]
) => {
  const setTableToStore = useSettings.getState().setDraughtTable
  let resultTable: TableItem[] = []
  changedDraughtArray.map((changedDraughtArrayItem, index) => {
    if (changedDraughtArray[0].draught !== dataArray[0].draught) {
      resultTable = [
        ...resultTable,
        ...calculateTable(
          changedDraughtArray[0].tonnage,
          dataArray[0].tonnage,
          changedDraughtArray[0].draught,
          dataArray[0].draught
        ),
      ]
    }
    if (index !== changedDraughtArray.length - 1) {
      resultTable = [
        ...resultTable,
        ...calculateTable(
          changedDraughtArray[index + 1].tonnage,
          changedDraughtArrayItem.tonnage,
          changedDraughtArray[index + 1].draught,
          changedDraughtArrayItem.draught
        ),
      ]
    }
    if (index === changedDraughtArray.length - 1) {
      if (
        dataArray[dataArray.length - 1].draught >
        changedDraughtArrayItem.draught
      ) {
        resultTable = [
          ...resultTable,
          ...calculateTable(
            dataArray[dataArray.length - 1].tonnage,
            changedDraughtArrayItem.tonnage,
            dataArray[dataArray.length - 1].draught,
            changedDraughtArrayItem.draught
          ),
        ]
      }
    }
  })
  setTableToStore(
    resultTable.filter(
      (item, i, array) =>
        i === array.findIndex(element => element.draught === item.draught)
    )
  )
}
