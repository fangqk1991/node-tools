import { OrderDirection, SQLSearcher } from 'fc-sql'

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

  public useSorting() {
    this._forSorting = true
  }

  public addBuilderAND(builder: SearchBuilder) {
    const { conditions, values } = builder.buildConditionsAndValues()
    this.addCondition(conditions.join(' AND '), ...values)
  }

  public addCondition(condition: string, ...args: any[]) {
    this._conditions.push({
      entity: `(${condition})`,
      args: args,
    })

    if (this._forSorting) {
      this.addOrderRule(`IF(${condition}, 1, 0)`, 'DESC', ...args)
    }
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
    searcher.addSpecialCondition(conditions.join(' OR '), ...values)

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
