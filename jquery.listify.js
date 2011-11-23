(function($)
{
    $.fn.listify = function(suggestions) {
        var suggestions = suggestions || [];

        var methods = {
            updateInput: function(listified)
            {
                var tagString = "";

                $("li:not(.input)", listified).each(function()
                {
                    var tag = $(this).contents().get(0).textContent;

                    tagString += tag + ',';
                });

                tagString = tagString.substring(0, tagString.length-1);;

                listified.prev("input").val(tagString);
            },

            updateList: function(input)
            {
                if (!input.val().length) {
                    return;
                }

                var items = input.val().split(",");

                methods.addItems(input.next(".listify")[0], items)
            },

            addItems: function(listified, items)
            {
                for (var i in items) {
                    var $item = $('<li>' + items[i] + '<a href="#">&times;</a></li>');

                    $(".input", listified).before($item);

                    $item.click(function(e)
                    {
                        e.stopPropagation();
                    });

                    $("a", $item).click(function(e)
                    {
                        e.preventDefault();
                        e.stopPropagation();

                        $listify = $(this).closest(".listify");
                        $(this).parent().remove();

                        methods.updateInput($listify);
                        $listify.find("input").focus();
                    });
                }
            }
        }

        this.hide();
        var $list = $('<ul class="listify"><li class="input"><input /></li></ul>');
        this.after($list);

        methods.updateList(this);

        $list.click(function()
        {
            $("input", $list).focus();
        });

        $("input", this.next(".listify")).keydown(function(e)
        {
            $(this).css("width", ($(this).val().length * 0.65 + 1.5)  + "em");

            if ($(this).val() == "" && e.keyCode == "8") {
                if ($(this).parent().prev("li").hasClass("delete")) {
                    $(this).parent().prev("li").remove();
                    methods.updateInput($(this).closest(".listify"));
                } else {
                    $(this).parent().prev("li").addClass("delete");
                }
            } else {
                $(this).parent().prev("li").removeClass("delete");
            }

            if (e.keyCode == "13" || e.keyCode == "9") {
                if (e.keyCode == "13") {
                    e.preventDefault();
                }

                if ($(this).val() == "") {
                    return;
                }

                methods.addItems($(this).closest(".listify"), $(this).val().split(","));
                $(this).val("");
                methods.updateInput($(this).closest(".listify"));
            }
        })
        .keyup(function(e)
        {
            if (e.keyCode == "27") {
                $(this).val("");
            }

            $(this).closest('.listify').next(".listify-suggestions").remove();

            $suggestions = $('<ul class="listify-suggestions"></ul>');

            if ($(this).val().length) {
                for (var i in $(this).data("suggestions")) {
                    var s = $(this).data("suggestions")[i];

                    var items = $(this).closest(".listify").prev("input").val().split(",");

                    items = items.map(function(str){ return str.toLowerCase(); });

                    if (items.indexOf(s.toLowerCase()) > -1) {
                        continue;
                    }

                    if (s.toLowerCase().indexOf($(this).val().toLowerCase()) > -1) {
                        re = new RegExp($(this).val(), "gi");
                        $suggestions.append("<li>" + s.replace(re, "<strong>$&</strong>") + "</li>");
                    }
                }

                if ($("li", $suggestions).length) {
                    $(this).closest('.listify').after($suggestions);
                    $("li", $suggestions).click(function(e) {
                        methods.addItems($(this).parent().prev(".listify"), [ $(this).text() ]);
                        methods.updateInput($(this).parent().prev(".listify"));
                        $(this).parent().prev(".listify").find("input").val("").focus();
                        $(this).parent().remove();
                    });
                }
            }
        })
        .data('suggestions', suggestions.sort());

        $("body").click(function()
        {
            $(".listify-suggestions").remove();
        });
    };
})(jQuery);

