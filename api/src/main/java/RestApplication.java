import javax.ws.rs.core.Application;

import edu.mit.csail.sdg.translator.A4Solution;

import java.util.HashMap;
import java.util.UUID;

import javax.ws.rs.ApplicationPath;

@ApplicationPath("/")
public class RestApplication extends Application {
	
	public static HashMap<UUID, A4Solution> answers = new HashMap<>();
    
	public RestApplication() {
    	
    }
}

