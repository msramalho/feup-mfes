import edu.mit.csail.sdg.alloy4.A4Reporter;

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
        A4Reporter rep = new A4Reporter();
        return Response.ok("maps 2: method doGet invoked " + new Date()).build();
    }
}
