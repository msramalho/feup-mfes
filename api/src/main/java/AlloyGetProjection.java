import java.io.File;
import java.io.IOException;
import java.util.AbstractMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObjectBuilder;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;

import org.json.JSONArray;
import org.json.JSONObject;

import edu.mit.csail.sdg.alloy4viz.AlloyAtom;
import edu.mit.csail.sdg.alloy4viz.AlloyInstance;
import edu.mit.csail.sdg.alloy4viz.AlloyProjection;
import edu.mit.csail.sdg.alloy4viz.AlloyRelation;
import edu.mit.csail.sdg.alloy4viz.AlloySet;
import edu.mit.csail.sdg.alloy4viz.AlloyTuple;
import edu.mit.csail.sdg.alloy4viz.AlloyType;
import edu.mit.csail.sdg.alloy4viz.StaticInstanceReader;
import edu.mit.csail.sdg.alloy4viz.StaticProjector;
import edu.mit.csail.sdg.alloy4viz.VizState;
import edu.mit.csail.sdg.translator.A4Solution;

@Path("/getProjection")
public class AlloyGetProjection {
	@POST
	@Produces("text/json")
	public Response doGet(String body) throws IOException {
		String res = "";
		System.out.println(body);
		AbstractMap.SimpleEntry<UUID, List<Object> > req;
		try {
			req = parseJSON(body);
			A4Solution sol = RestApplication.answers.get(req.getKey());
			File tempFile = File.createTempFile("a4f", "als");
			tempFile.deleteOnExit();
			sol.writeXML(tempFile.getAbsolutePath());
			AlloyInstance myInstance = StaticInstanceReader.parseInstance(tempFile.getAbsoluteFile());
			
			JsonArrayBuilder jsonResponseBuilder = Json.createArrayBuilder();
			
			VizState myState = new VizState(myInstance);
			//clonamos o myState para obter um theme a usar abaixo para obter o originalName
			VizState theme= new VizState(myState);
			theme.useOriginalName(true);
			
			Map<AlloyType, AlloyAtom> map = new LinkedHashMap<AlloyType, AlloyAtom>();
			for (AlloyAtom alloy_atom : myState.getOriginalInstance().getAllAtoms()) {
				for (Object projectingType : req.getValue()) {	
					String pt = (String) projectingType;
					if (alloy_atom.getVizName(theme, true).replace("$","").equals(pt))
						map.put(alloy_atom.getType(), alloy_atom);
				}   
			}
			
			AlloyProjection currentProjection = new AlloyProjection(map);
			AlloyInstance projected = StaticProjector.project(myInstance, currentProjection);
			jsonResponseBuilder.add(projectedInstance2JSON(projected));
			
			res = jsonResponseBuilder.build().toString();
			
			
		} catch (Exception e) {
			System.out.println(e);
			e.printStackTrace();
			res = "invalid uuid";
		}
		

		return Response.ok(res).build();
	}

	private JsonObjectBuilder projectedInstance2JSON(AlloyInstance projected) {
		JsonObjectBuilder projectionsJSON = Json.createObjectBuilder();		

		VizState vs = new VizState(projected);
		vs.useOriginalName(true);

		JsonArrayBuilder jsonAtomsBuilder = Json.createArrayBuilder();
		//20180601
		JsonArrayBuilder jsonAtomsRelsBuilder = Json.createArrayBuilder(); 
		for (AlloyAtom a : projected.getAllAtoms()) {			
			jsonAtomsBuilder.add(a.getVizName(vs, true) );
			
			//20180601 relations to other atoms
			JsonObjectBuilder atomRel = Json.createObjectBuilder();
			atomRel.add("atom", a.getVizName(vs, true));
			JsonArrayBuilder jsonAtomRelsBuilder = Json.createArrayBuilder();
			List<AlloySet> sets = projected.atom2sets(a);
			if (sets!=null) {
				for(AlloySet set: sets) {
					jsonAtomRelsBuilder.add(set.getName());
				}				
			}
			atomRel.add("relations", jsonAtomRelsBuilder);
			jsonAtomsRelsBuilder.add(atomRel);
			//20180601
		}
			
		projectionsJSON.add("atoms", jsonAtomsBuilder);
		
		 //20180601objeto com os atomos e as relacaoes
		projectionsJSON.add("atom_rels", jsonAtomsRelsBuilder);
		
		JsonArrayBuilder jsonRelationsBuilder = Json.createArrayBuilder();
		for (AlloyRelation r : projected.model.getRelations()) {
			JsonObjectBuilder relationJsonBuilder = Json.createObjectBuilder();
			relationJsonBuilder.add("arity", r.getArity());
			relationJsonBuilder.add("relation", r.getName());

			JsonArrayBuilder relationTuplesJsonBuilder = Json.createArrayBuilder();
			for (AlloyTuple at : projected.relation2tuples(r)) {
				for (AlloyAtom atom : at.getAtoms()) {
					relationTuplesJsonBuilder.add(atom.getVizName(vs, true));
				}
			}
			relationJsonBuilder.add("tuples", relationTuplesJsonBuilder);
			jsonRelationsBuilder.add(relationJsonBuilder);
		}
		projectionsJSON.add("relations", jsonRelationsBuilder);
		
		return projectionsJSON;
	}
	
	private AbstractMap.SimpleEntry<UUID, List<Object> > parseJSON(String body) throws Exception {

		JSONObject jo = new JSONObject(body);
		UUID uuid = UUID.fromString(jo.getString("uuid"));
		JSONArray typesArray = jo.getJSONArray("type");
		List<Object> types = typesArray.toList();
	

		AbstractMap.SimpleEntry<UUID, List<Object> > req = new AbstractMap.SimpleEntry<>(uuid, types);

		return req;
	}

}
