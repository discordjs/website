<template>
  <div class="class-method class-item" :id="`doc-for-${scrollTo}`">
    <source-button :meta="method.meta" :docs="docs" />

    <h3>
      <router-link :to="{ name: 'docs-class', query: { scrollTo } }">
        .{{ method.name }}(<!--
				--><span v-for="param in params" class="method-param" :class="param.optional ? 'optional' : ''" :key="param.name"><!--
          -->{{ param.variable ? '...' : '' }}{{ param.name }}<!--
        --></span><!--
				-->)
      </router-link>
    </h3>
    <span v-if="method.scope === 'static'" class="badge" title="This method is on the class constructor function, not instances.">Static</span>
    <span v-if="method.abstract" class="badge" title="This method is abstract, and must be implemented in a child class.">Abstract</span>
    <span v-if="method.deprecated" class="badge warn" title="This method is deprecated, and may be removed in a future version.">Deprecated</span>
    <span v-if="method.access === 'private'" class="badge warn" title="This method is private, and may change or be removed at any time.">Private</span>

    <div class="class-item-details">
      <p v-html="description"></p>

      <param-table v-if="method.params" :params="method.params" :docs="docs" />

      <div class="method-return">
        Returns:
        <span v-if="method.returns">
          <types v-for="rtrn in method.returns.types || method.returns" :names="rtrn" :variable="method.returns.variable" :nullable="method.returns.nullable" :docs="docs" :key="typeKey(rtrn)" />
        </span>
        <type-link v-else :type="['void']" :docs="docs" class="docs-type" />
        <p v-if="method.returns && method.returns.description" v-html="returnDescription"></p>
      </div>

      <div v-if="method.throws" class="method-throws">
        Throws:
        <types v-for="thrw in method.throws" :names="thrw" :docs="docs" :key="thrw" />
      </div>

      <div v-if="emits" class="method-emits">
        Emits:
        <ul v-if="emits.length > 1">
          <li v-for="event in emits" :key="event.text">
            <router-link :to="event.link" class="docs-type">{{ event.text }}</router-link>
          </li>
        </ul>
        <router-link v-else :to="emits[0].link" class="docs-type">{{ emits[0].text }}</router-link>
      </div>

      <div v-if="method.examples" class="method-examples">
        Examples:
        <pre v-for="example in method.examples" :key="example"><code class="javascript">{{ example }}</code></pre>
      </div>

      <see v-if="method.see" :see="method.see" :docs="docs" />
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import Types from '../Types.vue';
import TypeLink from '../TypeLink.vue';
import ParamTable from './ParamTable.vue';
import SourceButton from '../SourceButton.vue';
import See from '../See.vue';
import { convertLinks, parseLink, typeKey } from '../../../util';

export default {
  name: 'class-method',
  props: ['method', 'docs'],
  components: {
    Types,
    TypeLink,
    ParamTable,
    SourceButton,
    See,
  },

  computed: {
    params() {
      if (!this.method.params) return null;
      return this.method.params.filter(p => !p.name.includes('.'));
    },

    description() {
      return Vue.filter('marked')(convertLinks(this.method.description, this.docs, this.$router, this.$route));
    },

    returnDescription() {
      return Vue.filter('marked')(convertLinks(this.method.returns.description, this.docs, this.$router, this.$route));
    },

    emits() {
      if (!this.method.emits) return null;
      return this.method.emits.map(e => parseLink(e.replace(/:event/i, ''), this.docs));
    },

    scrollTo() {
      return `${this.method.scope === 'static' ? 's-' : ''}${this.method.name}`;
    },
  },

  methods: {
    typeKey,
  },
};
</script>

<style lang="scss">
	@import '../../../styles/theming';

	.class-method {
		p:not(.docs-see) {
			margin: 0 0 12px 0;
		}

		h3 a:hover .method-param {
			color: $color-primary !important;
		}
	}

	.method-param {
		color: lighten($color-content-text, 20%);
		font-size: 1rem;
    transition: color 0.3s;

		&.optional:before {
			content: '[';
		}

		&.optional:last-child:after {
			content: ']';
		}

		&.optional:not(:last-child):after {
			content: '], ';
		}

		&:not(:last-child):after {
			content: ', '
		}
	}

	.method-return {
		margin-top: 20px;
		color: lighten($color-content-text, 35%);
    font-weight: bold;

		.docs-type {
			font-family: $font-monospace;
		}

    p {
      color: lighten($color-content-text, 10%);
      font-weight: normal;
    }
	}

	.method-throws, .method-emits, .method-examples {
		margin-top: 16px;
		color: lighten($color-content-text, 35%);
    font-weight: bold;

		pre {
			font-weight: normal;
		}
  }

  #app.dark {
    .method-param {
      color: darken($color-content-text-dark, 20%);
    }

    .method-return {
      color: darken($color-content-text-dark, 35%);

      p {
        color: darken($color-content-text-dark, 10%);
      }
    }

    .method-throws, .method-emits, .method-examples {
      color: darken($color-content-text-dark, 35%);
    }
  }
</style>
