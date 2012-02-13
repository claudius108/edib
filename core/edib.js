/*
Copyright (C) 2010 kuberam.ro - Claudius Teodorescu. All rights reserved.
Released under LGPL License - http://gnu.org/licenses/lgpl.html.	
*/

//alert( ( new XMLSerializer() ).serializeToString( text ) );

edib = {
	xquery : function( queryText ) {
		return edib.ajaxReq( queryText );
	},
	ajaxReq : function( queryText ) {
		var wrappedQuery = ' <query xmlns="http://exist.sourceforge.net/NS/exist" start="1" max="20"><text><![CDATA[' + queryText + ']]></text><properties><property name="indent" value="yes"/></properties></query>',
			request = false,
			response = '';
		if ( window.XMLHttpRequest ) {
       			request = new XMLHttpRequest();
			} else if ( window.ActiveXObject ) {
				try {
				request = new ActiveXObject("Msxml2.XMLHTTP"); }
					catch (e) {
					try {
						request = new ActiveXObject("Microsoft.XMLHTTP");
					} catch (e) {}
				}
		}

		request.open( "POST", "http://localhost:8080", false );
		request.setRequestHeader( 'Content-Type', 'text/xml' );
		try {
			request.send( wrappedQuery );
			return request.responseText;
			} catch (e) {
				alert( "I guess the local eXist is not started yet!" );
				return 'eDIB: Error in processing the request to local eXist!';
		}
	},
	ajaxReqResponse : '',
	queryResult : '',
	utils : {
		poll : function( condition ) {
			if ( edib.utils.pollingConditions[ condition ].testedValue() ) {
				edib.utils.pollingConditions[ condition ].executedFunction();
				} else {
					setTimeout( function() { edib.utils.poll( condition ); }, 50);
			}
		},
		pollingConditions : {
			processScripts : {
				testedValue : function() {
					return ( document.body != null );
				},
				executedFunction : function() {
					var scripts = document.querySelectorAll( "script[type = 'text/xquery']" );
					for ( var i=0, il = scripts.length; i < il; i++ ) {
						var script = scripts[ i ];
						edib.xquery( script.text );
					}
				}
			}
		},
		pollTestedValues : {
			responseContainerDone : 0
		},
		cleanWhitespace : function(node) {//Author: Alex Vincent
			for (var i=0; i<node.childNodes.length; i++)
			{
			var child = node.childNodes[i];
			if(child.nodeType == 3 && !/\S/.test(child.nodeValue))
			{
			node.removeChild(child);
			i--;
			}
			if(child.nodeType == 1)
			{
			cleanWhitespace(child);
			}
			}
			return node;
		}
	}
}

edib.utils.poll( 'processScripts' );