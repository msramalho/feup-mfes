import java.io.File;
import java.io.IOException;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;

import org.json.JSONObject;

import edu.mit.csail.sdg.alloy4.A4Reporter;
import edu.mit.csail.sdg.ast.Command;
import edu.mit.csail.sdg.ast.Expr;
import edu.mit.csail.sdg.parser.CompModule;
import edu.mit.csail.sdg.parser.CompUtil;
import edu.mit.csail.sdg.translator.A4Options;
import edu.mit.csail.sdg.translator.A4Solution;
import edu.mit.csail.sdg.translator.TranslateAlloyToKodkod;
import utils.InstancesRequest;

@Path("/getInstances")
public class AlloyGetInstances {
	@GET
	@Produces("text/json")
	public Response doGet(String body) throws IOException {
		InstancesRequest req = parseJSON(body);

		A4Reporter rep = new A4Reporter();
		File tmpAls = CompUtil.flushModelToFile(req.model, null);

		CompModule world = CompUtil.parseEverything_fromString(rep, req.model);
		A4Options opt = new A4Options();
		opt.originalFilename = tmpAls.getAbsolutePath();
		opt.solver = A4Options.SatSolver.SAT4J;
		Command cmd = world.getAllCommands().get(0);
		A4Solution sol = TranslateAlloyToKodkod.execute_command(rep, world.getAllReachableSigs(), cmd, opt);
		assert sol.satisfiable();
		// sol.writeXML(outputfilename);

		// eval with existing A4Solution
		Expr e = CompUtil.parseOneExpression_fromString(world, "univ");
		System.out.println(sol.eval(e));
		e = CompUtil.parseOneExpression_fromString(world, "Point");
		System.out.println(sol.eval(e));

		// reload everything from files

		/*
		 * XMLNode xmlNode = new XMLNode(new File(outputfilename)); String
		 * alloySourceFilename = xmlNode.iterator().next().getAttribute("filename");
		 * CompModule ansWorld = CompUtil.parseEverything_fromFile(rep, null,
		 * alloySourceFilename); A4Solution ans =
		 * A4SolutionReader.read(ansWorld.getAllReachableSigs(), xmlNode);
		 * 
		 * Expr e1 = CompUtil.parseOneExpression_fromString(ansWorld, "univ");
		 * System.out.println(ans.eval(e1)); e1 =
		 * CompUtil.parseOneExpression_fromString(ansWorld, "Point");
		 * System.out.println(ans.eval(e1));
		 */

		return Response.ok().build();
	}

	private InstancesRequest parseJSON(String body) {
		JSONObject jo = new JSONObject(body);
		InstancesRequest req = new InstancesRequest();

		req.model = jo.getString("model");
		req.numberOfInstances = jo.getInt("numberOfInstances");
		req.forceInterpretation = jo.getBoolean("forceInterpretation");
		req.commandLabel = jo.getString("commandLabel");

		return null;
	}
}
