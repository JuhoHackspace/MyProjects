package fi.oamk.muuvi.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
// disable database initialization since it's not configured
@EnableAutoConfiguration(exclude = DataSourceAutoConfiguration.class)
class BackendApplicationTests {

	@Test
	void contextLoads() {
	}

}
