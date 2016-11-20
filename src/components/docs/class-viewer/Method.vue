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

    <div class="class-item-details">
      <p v-html="description"></p>
			<param-table v-if="method.params.length > 0" :params="method.params" :docs="docs" />
			<div class="method-return">
				Returns:
				<types v-for="rtrn in method.returns.types" :names="rtrn" :docs="docs" />
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
  import ParamTable from './ParamTable.vue';
  import SourceButton from '../SourceButton.vue';

  export default {
    name: 'class-method',
    props: ['method', 'docs'],
    components: {
      Types,
      ParamTable,
      SourceButton,
    },

    data() {
      return {
        description: Vue.filter('marked')(this.method.description),
      };
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
		margin-top: 16px;
		color: lighten($color-content-text, 35%);
		font-weight: bold;

		.docs-type {
			font-family: $font-monospace;
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
