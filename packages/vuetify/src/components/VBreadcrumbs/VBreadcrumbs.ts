// Styles
import '../../stylus/components/_breadcrumbs.styl'

// Types
import { VNode } from 'vue'
import { PropValidator } from 'vue/types/options'

// Components
import { VBreadcrumbsDivider, VBreadcrumbsItem } from '.'

// Mixins
import Themeable from '../../mixins/themeable'

// Utils
import { deprecate } from '../../util/console'
import mixins from '../../util/mixins'

export default mixins(
  Themeable
  /* @vue/component */
).extend({
  name: 'v-breadcrumbs',

  props: {
    divider: {
      type: String,
      default: '/'
    },
    items: {
      type: Array,
      default: () => ([])
    } as PropValidator<any[]>,
    large: Boolean,
    justifyCenter: Boolean,
    justifyEnd: Boolean
  },

  computed: {
    classes (): object {
      return {
        'v-breadcrumbs--large': this.large,
        'justify-center': this.justifyCenter,
        'justify-end': this.justifyEnd,
        ...this.themeClasses
      }
    }
  },

  mounted () {
    if (this.justifyCenter) deprecate('justify-center', 'class="justify-center"', this)
    if (this.justifyEnd) deprecate('justify-end', 'class="justify-end"', this)
  },

  methods: {
    genDivider () {
      return this.$createElement(VBreadcrumbsDivider, this.$slots.divider ? this.$slots.divider : this.divider)
    },
    genItems () {
      const items = []
      const hasSlot = !!this.$scopedSlots.item
      const keys = []

      for (let i = 0; i < this.items.length; i++) {
        const item = this.items[i]

        keys.push(item.text)

        if (hasSlot) items.push(this.$scopedSlots.item!({ item }))
        else items.push(this.$createElement(VBreadcrumbsItem, { key: keys.join('.'), props: item }, [item.text]))

        if (i < this.items.length - 1) items.push(this.genDivider())
      }

      return items
    }
  },

  render (h): VNode {
    const children = this.$slots.default || this.genItems()

    return h('ul', {
      staticClass: 'v-breadcrumbs',
      'class': this.classes
    }, children)
  }
})
