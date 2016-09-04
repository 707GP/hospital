import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

import org.junit.Test;

import com.hrs.common.IDGenerator;

public class GeneratorTest {

    @Test
    public void testIdGenerator() {
		final IDGenerator idGen = IDGenerator.get();
		long id = 0;
		for (int i = 0; i < 10; i++) {
			id = idGen.nextId();
			System.out.println("id: " + i + ":" + id);
		}
  
    }
}