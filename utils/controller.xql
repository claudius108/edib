xquery version "1.0";

declare namespace c="http://exist-db.org/xquery/controller";

import module namespace request="http://exist-db.org/xquery/request";
import module namespace xdb = "http://exist-db.org/xquery/xmldb";

let $serverName := request:get-server-name()
return
	if ( xs:string($serverName) = 'localhost' ) then
		<dispatch xmlns="http://exist.sourceforge.net/NS/exist">
			<set-header name="Access-Control-Allow-Origin" value="*"/>
		</dispatch>
	else
	<dispatch xmlns="http://exist.sourceforge.net/NS/exist">
		<forward url="/xdib_denyAccess.htm"/>
	</dispatch>