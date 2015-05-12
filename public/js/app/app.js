(function($,_){
	var app = app || {};
	App = function(){
		var elements = _.range(9).map(function(index){
			return{
				value:String.fromCharCode(97+index),
				id:index
			}
		});
		var self = this;
		var _init = function(){
			self.elements=_.shuffle(elements);
			self.el = document.querySelector('#app');
			self.template = _.template(document.querySelector('#view').innerHTML);
			_render();
		};
		var _render = function(){
			self.el.innerHTML = self.template({elements:self.elements});
			var elementSpans = document.querySelectorAll('.element');
			_evaluate();
			_.each(elementSpans,function(elementSpan){
				addEvent(elementSpan, 'dragstart', function (e) {
					
					e.dataTransfer.setData('id',this.dataset.id); // set *something* required otherwise doesn't work
					this.classList.add('dragged');
				});
				addEvent(elementSpan, 'dragend', function (e) {
					this.classList.remove('dragged');
				});				
				addEvent(elementSpan, 'dragover', function (e) {
					if (e.preventDefault) e.preventDefault(); // allows us to drop
					this.classList.add('over');
					return false;
					});
					addEvent(elementSpan, 'dragleave', function () {
					this.classList.remove('over')
					});
				addEvent(elementSpan, 'drop', _onDrop);
			});
		};
		var _onDrop = function (e) {
			if (e.stopPropagation) e.stopPropagation(); // stops the browser from redirecting...why???
			var dragId = parseInt(e.dataTransfer.getData('id'));
			var dropId =  parseInt(this.dataset.id);
			var dropData = _.find(self.elements,function(element){
				return element.id === dropId;
			});
			var dragData = _.find(self.elements,function(element){
				return element.id === dragId;
			});
			var dragIndex = _.indexOf(self.elements,dragData);
			var dropIndex = _.indexOf(self.elements,dropData);
			self.elements[dragIndex] = dropData;
			self.elements[dropIndex] = dragData;
			_render();
			
			return false;
		};
		var addEvent = function(element,event,fn){
			element.addEventListener(event,fn);
		}
		var _evaluate = function(){
			var result = _.reduce(self.elements,function(memo,element){return memo+element.value},'')
			if(result === 'abcdefghi'){
				$("#result").text('Correct');
			}else{
				$("#result").text('Wrong.  Wrong!  WRONG!!!!');
			}
		}
		return {
			init:_init,
			render:_render
		};

	}
	var app = new App();
	app.init();
})(jQuery,_);