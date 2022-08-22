import { OrderDirection, SQLSearcher } from 'fc-sql'
import * as assert from 'assert'

interface OrCondition {
  entity: string
  args: (string | number)[]
}

interface OrderRule {
  sortKey: string
  direction: OrderDirection
  args: (string | number)[]
}

export class SearchBuilder {
  private _conditions: OrCondition[] = []
  private _forSorting = false
  private _orderRules: OrderRule[] = []
  private _logic: 'AND' | 'OR' = 'OR'

  public static builderWithLogic(logic: 'AND' | 'OR') {
    const builder = new SearchBuilder()
    builder.setLogic(logic)
    return builder
  }

  public useSorting() {
    this._forSorting = true
  }

  public setLogic(logic: 'AND' | 'OR') {
    assert.ok(logic === 'AND' || logic === 'OR', 'logic invalid.')
    this._logic = logic
    return this
  }

  public logic() {
    return this._logic
  }

  /**
   * @deprecated
   */
  public addBuilderAND(builder: SearchBuilder) {
    const { conditions, values } = builder.buildConditionsAndValues()
    this._addCondition(conditions.join(' AND '), values)
    return this
  }

  public pickBuilder(builder: SearchBuilder) {
    const { conditions, values } = builder.buildConditionsAndValues()
    this._addCondition(conditions.join(` ${builder.logic()} `), values)
    return this
  }

  public static jointBuilders(builders: SearchBuilder[], logic: 'AND' | 'OR') {
    const builder = SearchBuilder.builderWithLogic(logic)
    for (const item of builders) {
      builder.pickBuilder(item)
    }
    return builder
  }

  public addConditionKV(key: string, value: string | number) {
    if (/^\w+$/.test(key)) {
      key = `\`${key}\``
    }
    this._addCondition(`(${key} = ?)`, [value])
    return this
  }

  public addConditionKeyInArray(key: string, values: (string | number)[]) {
    if (values.length === 0) {
      this._addCondition('1 = 0')
      return this
    }
    const quotes = Array(values.length).fill('?').join(', ')
    if (/^\w+$/.test(key)) {
      key = `\`${key}\``
    }
    this._addCondition(`${key} IN (${quotes})`, values)
    return this
  }

  public addConditionKeyNotInArray(key: string, values: (string | number)[]) {
    if (values.length === 0) {
      this._addCondition('1 = 1')
      return this
    }
    const quotes = Array(values.length).fill('?').join(', ')
    if (/^\w+$/.test(key)) {
      key = `\`${key}\``
    }
    this._addCondition(`${key} NOT IN (${quotes})`, values)
    return this
  }

  private _addCondition(condition: string, args: any[] = []) {
    this._conditions.push({
      entity: `(${condition})`,
      args: args,
    })

    if (this._forSorting) {
      this.addOrderRule(`IF(${condition}, 1, 0)`, 'DESC', ...args)
    }
  }

  public addCondition(condition: string, ...args: any[]) {
    this._addCondition(condition, args)
  }

  addOrderRule(sortKey: string, direction: OrderDirection = 'ASC', ...args: (string | number)[]) {
    this._orderRules.push({
      sortKey: sortKey,
      direction: direction,
      args: args,
    })
  }

  public injectToSearcher(searcher: SQLSearcher) {
    if (this._conditions.length === 0) {
      return
    }

    const { conditions, values } = this.buildConditionsAndValues()
    searcher.addSpecialCondition(conditions.join(` ${this._logic} `), ...values)

    for (const orderRule of this._orderRules) {
      searcher.addOrderRule(orderRule.sortKey, orderRule.direction, ...orderRule.args)
    }
  }

  public buildConditionsAndValues() {
    const conditions: string[] = []
    const values: (string | number)[] = []
    for (const condition of this._conditions) {
      conditions.push(condition.entity)
      values.push(...condition.args)
    }
    return {
      conditions: conditions,
      values: values,
    }
  }
}
