/*eslint no-unused-vars: "off"*/
class Tag {
    constructor(id, value, {
        sign,
        bool,
        isInfo = false,
        isShort = false,
        best = [],
        normal = [],
        danger = []
    }) {
        this.id = id
        this.element = document.getElementById(this.id)
        this._value = value
        this.sign = sign
        this.isInfo = isInfo
        this.isShort = isShort
        this._bool = bool
        this.best = best
        this.normal = normal.length < 1 ? [best[1], danger[0]] : normal
        this.danger = danger
    }

    set value(val) {
        this._value = val || '-'

        if (this.bool !== true) {
            this.clear()
            this.element.classList.add(this.style())
            this.element.textContent = this.value
        }
    }

    get value() {
        let format = ''
        switch (this.sign) {
            case '$':
                format = this.sign + this._value
                break

            case '%':
                format = this._value + this.sign
                break

            default:
                format = this._value
                break
        }
        return format
    }

    set bool(val) {
        this._bool = val
        this.clear()
        this.element.classList.add(this.style())
        if (this.bool) {
            this.element.textContent = 'ON'
        } else if (this.bool === false) {
            this.element.textContent = 'OFF'
        }
    }

    get bool() {
        return this._bool
    }

    clear() {
        this.element.classList.remove('is-success', 'is-danger', 'is-warning', 'is-light', 'is-link')
        this.element.textContent = ''
    }

    style() {
        if (this.isInfo) return 'is-light'
        if (this.isShort) return 'is-link'
        if (this.bool) return 'is-success'
        if (this.bool === false) return 'is-danger'
        if (this.value === '-') return 'is-warning'
        if (this._value > this.best[0] && this._value <= this.best[1]) return 'is-success'
        if (this._value > this.normal[0] && this._value <= this.normal[1]) return 'is-warning'
        if (this._value > this.danger[0] && this._value <= this.danger[1]) return 'is-danger'
        if (this._value > this.normal[1] && this.normal[1] > this.danger[0]) return 'is-danger'
        return 'is-light'
    }
}
