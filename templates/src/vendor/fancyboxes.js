/* 
License:
You can use and/or modify FancyBoxes as long as you leave this notice at the top.
FancyBoxes project page: http://projects.functino.com/fancyboxes/
Inspired By: Stephane Caron's jQuery plugin "prettyCheckboxes" (http://www.no-margin-for-errors.com/projects/prettyCheckboxes/)
*/
var FancyBoxes = Class.create({
  initialize: function(options){
    this.options = Object.extend(Object.clone(FancyBoxes.OPTIONS), options || {});
    this.elements = this.options.elements;
    // this.elements can either be a css-selector string or an array of elements
    if(Object.isString(this.elements))
    {
      this.elements = $$(this.elements);
    }
    if(this.options.autoBind)
    {
      this.bind();
    }
  },
  bind: function(){
    // to avoid "double" checkboxes, unbind FancyBoxes first
    this.unbind();
    var options = this.options;
    var findLabel = this._findLabel;
    this.elements.each(function(it){
      var label = findLabel(it);
      if(!label)
      {
        return false;
      }

      var holderWrap = new Element('span', {'class': options.cssPrefix + 'holderWrap'});
      var holder = new Element('span', {'class': options.cssPrefix + 'holder'});
      holderWrap.insert(holder);
      // avoid code like <label><span>...</span><input ..> text</label>
      // because IE doesn't trigger click events then
      if(it.up('label'))
      {
        it.insert({after: holderWrap}); // <label><input ... > [insert here] text</label>
      }
      else
      {
        label.insert({top: holderWrap}); // <input id="x" > <label for="x"> [insert here] text </label>
      }

      if(it.checked) 
      { 
        label.addClassName(options.cssPrefix + 'checked'); 
      };

      label.addClassName(options.cssPrefix + 'box')
        .addClassName(options.cssPrefix + it.readAttribute('type'))
        .addClassName(options.cssPrefix + options.display);

      // Hide the original input-elements
      it.addClassName(options.cssPrefix + 'hidden');	

      if(options.images)
      {
        if(it.readAttribute('type').toLowerCase() == 'checkbox')
        {
          holder.setStyle({backgroundImage: 'url(' + options.images.checkbox + ')'});
        }
        else
        {
          holder.setStyle({backgroundImage: 'url(' + options.images.radio + ')'});
        }
      }

      it.observe('click', function(ev){
        var label = findLabel(ev.element());
        if(label.hasClassName(options.cssPrefix + 'checkbox'))
        {
          label.toggleClassName( options.cssPrefix + 'checked');						
        }
        else if(label.hasClassName(options.cssPrefix + 'radio'))
        {
          // Uncheck all radios
          $$('input[name="'+ ev.element().readAttribute('name')+'"][type=radio]').each(function(it){
            findLabel(it).removeClassName(options.cssPrefix + 'checked');
          });
          label.addClassName(options.cssPrefix + 'checked');						
        }
      });
        it.observe('focus', function(ev){
			label.addClassName(options.cssPrefix + 'focus');
		}.bind(this));
		it.observe('blur', function(ev){
			label.removeClassName(options.cssPrefix + 'focus');
		}.bind(this));		
	  	
      label.observe('mouseover', function(ev){
        ev.element().addClassName(options.cssPrefix + 'hover');
      });
      label.observe('mouseout', function(ev){
        ev.element().removeClassName(options.cssPrefix + 'hover');
      });
    });
  },
  unbind: function(){
    this.elements.each(function(it){
      var label = this._findLabel(it);
      // remove event listeners
      it.stopObserving('click');
      it.stopObserving('mouseover');
      it.stopObserving('mouseout');
      it.stopObserving('focus');
      it.stopObserving('blur');

      // remove added classes
      it.removeClassName(this.options.cssPrefix + 'hidden');
      label.removeClassName(this.options.cssPrefix + 'box');
      label.removeClassName(this.options.cssPrefix + it.readAttribute('type'));	
      label.removeClassName(this.options.cssPrefix + this.options.display);
      label.removeClassName(this.options.cssPrefix + 'checked');
      label.removeClassName(this.options.cssPrefix + 'focus');

      // remove inserted elements
      var span = label.down('.' + this.options.cssPrefix + 'holderWrap');
      if(span)
      {
        span.remove();	
      }
    }.bind(this));
  },
  // private function to find the label for each input, detects labels in two ways
  _findLabel: function(input){
    // detect <label><input type="text" name="a" /> MyLabel</label>
    var label = input.up('label');
    if(!label)
    {
      // detect <input type="text" name="a" id="a" /> <label for="a">MyLabel</label>
      var labels = $$('label[for="' + input.readAttribute('id') + '"]');
      label =  labels[0];
    }
    return label;
  }
});
FancyBoxes.OPTIONS = {
  //by default convert all checkboxes and radio-elements to FancyBoxes
  // elements can either be a string (used as css-selector $$()) or an array of input-elements
  elements: 'input[type=checkbox],input[type=radio]', 
  autoBind: true, // convert boxes automatically, if set to false you have to call FancyBoxes.bind()
  cssPrefix: 'fb_', // prefix for all css-classes used by FancyBoxes
  display: 'block', // display the box as inline or block
  images: false
}; 