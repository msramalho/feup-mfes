package api;

import javax.ws.rs.Path;
import javax.ws.rs.core.Response;
import javax.ws.rs.GET;
import javax.ws.rs.Produces;
import java.util.Date;

@Path("/greet")
public class HelloService {

	@GET
	@Produces("text/plain")
	public Response doGet() {
		return Response.ok("maps: method doGet invoked " + new Date()).build();
	}
}
