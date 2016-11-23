<template>
  <div class="class-method class-item" :id="`doc-for-${method.name}`">
    <source-button :meta="method.meta" :docs="docs" />

    <h3>
			<router-link :to="{ name: 'docs-class', query: { scrollTo: method.name } }">
				.{{ method.name }}(<!--
				--><span v-for="param in method.params" class="method-param" :class="param.optional ? 'optional' : ''">{{ param.name }}</span><!--
				-->)
			</router-link>
		</h3>
    <span v-if="method.access === 'private'" class="class-item-badge" title="This method is private, and may not exist as-is in future versions.">Private</span>

    <div class="class-item-details">
      <p v-html="description"></p>

			<param-table v-if="method.params && method.params.length > 0" :params="method.params" :docs="docs" />

			<div class="method-return">
        Returns:
        <span v-if="method.returns">
  				<types v-for="rtrn in method.returns.types" :names="rtrn" :docs="docs" />
        </span>
        <type-link v-else :type="['void']" :docs="docs" />
        <p v-if="method.returns && method.returns.description">{{ method.returns.description }}</p>
			</div>

			<div class="method-examples" v-if="method.examples && method.examples.length > 0">
				Examples:
				<pre v-for="example in method.examples"><code class="javascript">{{ example }}</code></pre>
			</div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import Types from '../Types.vue';
  import TypeLink from '../TypeLink.vue';
  import ParamTable from './ParamTable.vue';
  import SourceButton from '../SourceButton.vue';

  export default {
    name: 'class-method',
    props: ['method', 'docs'],
    components: {
      Types,
      TypeLink,
      ParamTable,
      SourceButton,
    },

    computed: {
      description() {
        return Vue.filter('marked')(this.method.description);
      },
    },
  };
</script>

<style lang="scss">
	@import '../../../styles/theming';

	.class-method {
		p {
			margin: 0 0 8px 0;
		}

		h3 a:hover .method-param {
			color: $color-primary;
		}
	}

	.method-param {
		color: lighten($color-content-text, 20%);
		font-size: 1rem;

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

	.method-examples {
		margin-top: 16px;
		color: lighten($color-content-text, 35%);
		font-weight: bold;

		pre {
			font-weight: normal;
		}
	}
</style>
