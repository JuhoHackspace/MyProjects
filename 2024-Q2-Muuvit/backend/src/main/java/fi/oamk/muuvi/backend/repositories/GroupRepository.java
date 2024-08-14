package fi.oamk.muuvi.backend.repositories;

import fi.oamk.muuvi.backend.models.Group;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

//import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

public interface GroupRepository extends CrudRepository<Group, Long> {

    @Query(value="SELECT g.* FROM groups_ g JOIN userstogroups utog ON g.group_id = utog.group_id WHERE utog.user_id=?2 LIMIT 10 OFFSET (?1-1)*10", nativeQuery = true)
    ArrayList<Group> findMyGroups(Integer page, Long userId);

    @Query(value="SELECT g.* FROM groups_ g ORDER BY g.group_name LIMIT 10 OFFSET (?1-1)*10", nativeQuery = true)
    ArrayList<Group> findGroupsPaginated(int page);

    @Query(value="SELECT COUNT(*) FROM groups_", nativeQuery = true)
    Integer countAllGroups();

    @Query(value="SELECT g.* FROM groups_ g", nativeQuery = true)
    List<Group> findAllGroups();

    @Query(value="SELECT COUNT(*) FROM userstogroups WHERE user_id=?1", nativeQuery = true)
    Integer countMyGroups(Long userId);

    @Query(value="SELECT g.* FROM groups_ g JOIN userstogroups utog ON g.group_id = utog.group_id WHERE utog.user_id=?1 AND ( utog.status = 'accepted' OR utog.status = 'owner' )  ORDER BY g.group_name", nativeQuery = true)
    ArrayList<Group> findAllGroupsByUserId(Long userId);

    @Query(value="SELECT g.* FROM groups_ g JOIN userstogroups utog ON g.group_id = utog.group_id WHERE utog.group_id=?1", nativeQuery = true)
    Optional<Group> findByGroupId(Long groupId);

 

}
