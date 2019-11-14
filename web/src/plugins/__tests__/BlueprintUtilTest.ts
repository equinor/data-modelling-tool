import {BlueprintUtil} from "../BlueprintUtil";


describe('BlueprintUtilTest',() => {
	let blueprintUtil: any;


	beforeEach(() => {
		blueprintUtil = new BlueprintUtil({
			name: '',
			description: '',
			type: '',
			attributes: [
				{name: 'test', type: 'string'}
			],
			uiRecipes: [
				{
					plugin: 'edit',
					attributes: [
						{
							name: 'test',
							widget: 'textarea'
						}
					]
				}
			],
			storageRecipes: []
		}, 'edit')
	})

	it('Should ', () => {
		const uiAttribute = blueprintUtil.getUiAttribute('test', 'edit')
		expect(uiAttribute).toEqual({name: 'test', widget: 'textarea'})
	})
})